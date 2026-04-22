# Troubleshoot Guide - Backend Setup
## Node JS | Express | Typescript | Sequelize | PostgreSQL

### 1. Project Structure Setup
**Issue**: where to place configuration files?
- Solution:
  - utils/ --> logger, asyncHandler
  - middlewares/ --> error handler, not found handler, validation
  - controllers/ --> business logic
  - routes/ -- route definitions
  - errors/ --> custom error class
  - validation/ --> Zod schema validation
  - models/ --> Sequelize models
  - db/ --> database connection, migrations, seeders
  - config/ configuration files
- **Naming convention**: `resource.type.ts` (e.g. `auth.controller.ts`, `validate.middleware.ts`)

### 2. Error Handling
**Issue**: Server crashes when throwing errors in async controller.
- **Solution**: Create handling error middleware with 4 parameters `(err, req, res, next)` and place it after all routes in `app.ts`.
```
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  /* some error handling logic here */
};
```
**Issue**: Built-in Error class doesn't have status code.
- **Solution**: Creata custom `ApiError` class that extend `ERROR` and add `statusCode` property.
```
class ApiError extends Error {
  statusCode: number;
  constructor({ message, statusCode }: ApiErrorType) {
    super(message);
    this.statusCode = statusCode;
  }
}
```
**Issue**: 404 errors on unknown routes return HTML instead of JSON.
- **Solution**: Create notFoundHandler middleware and place it before error middleware but after all routes.
```
const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });

  return;
};
```

**Issue**: After `POST` to create student, postman throw internal server error, terminal no error log. Error likely is caught by asyncHandler and pass to error middleware. There is log for reqBody data, but doesn't log newStudent data. To find the cause, wrap with trycatch to log the error.

Before:
```
export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const reqBody = createStudentSchema.safeParse(req.body);
    if (reqBody.success) {
        console.log(reqBody.data)
      const newStudent = await Student.create(reqBody.data);
      console.log(newStudent)
      res.status(201).json({ success: true, data: newStudent });
    } else {
      throw new ApiError({
        statusCode: 400,
        message: fromZodError(reqBody.error).message,
      });
    }
  },
);
```
After wrapping in trycatch
```
export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const reqBody = createStudentSchema.safeParse(req.body);
    if (reqBody.success) {
      try {
        const newStudent = await Student.create(reqBody.data);
        res.status(201).json({ success: true, data: newStudent });
      } catch (error) {
        console.error(`Create student error: ${error}`);
        throw error;
      }
    }
  },
);
```

### Order In app.ts
1. Security middleware (cors, helmet).
2. Routes (auth, user).
3. notFoundHandler.
4. errorHandler.

### 3. Database Setup (Sequelize + PostgreSQL)

**Issue**: ERROR: Please install mysql2 package manually during connection to DB.
- **Solution**: Sequelize config has wrong dialect. Change to `dialect: 'postgres'` and ensure `pg` package is installed.

**Issue**: Cannot use `process.env` in config.json
- **Solution**: Rename to `config.js` and use `require('dotenv').config()` at the top

**Issue**: Sequelize CLI cannot read environment variables (all undefined)

- **Solution**:
  - Ensure .env is at project root
  - Run commands from project root, not from db/ folder
  - Use .sequelizerc to define custom paths
  - Add require('dotenv').config() in config.js

**Issue**: ERROR: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string (During DB migration)
- **Solution**: process.env.DB_PASSWORD is undefined. Check dotenv loading and .env file location
- .sequelizerc setup:
  - Depending on the project folder setup, take note on the `'config'` folder path. It might be `'src/config'`
  - Place the file at backend root and run migrations from backend root.
```
const path = require('path');

module.exports = {
  'config': path.resolve(__dirname, 'config', 'config.js'),
  'models-path': path.resolve(__dirname, 'db', 'models'),
  'seeders-path': path.resolve(__dirname, 'db', 'seeders'),
  'migrations-path': path.resolve(__dirname, 'db', 'migrations'),
};
```

### 4. Migrations

**Issue**: require() of ES Module not supported or Cannot use import statement outside a module
- **Solution**: Sequelize CLI expects CommonJS syntax in migration files. Use module.exports and require(), not import/export

**Issue**: Error found: Create student error: SequelizeValidationError: Validation error: {} is not a valid uuid (version: all)
- **Solution**:
  - Use `default: Sequelize.UUIDV4`
  - Don't include `id` in request validation schema (should be auto-generated)

**Issue**: Duplicate `createAt` and `updatedAt` column in DB
- **Solution**: Should not include column `createdAt` and `updatedAt`, as these columns are generated when inserting data to database

**Issue**: Different table name in DB
- **Solution**: 
  - Sequelize automatically pluralize and capitalize table name by default.
  - To set it to no capitalize, set a TABLE decorator on top of the class Model, to explicitly define the table name.
    ```
    @TABLE({
        tablename: 'users'
    })
    export class User...
    ```
### 5. Validation (Zod)

**Issue**: Messy error messages from Zod (escaped JSON)
- **Solution**: Create a separate validation middleware. Use `ZodType` from `zod` to format it cleanly.
  ```
  const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join('.'),
        err: err.message,
      }));
    }}}
  ```

**Issue**: Where to put validation logic?
- **Solution**: Create validation middleware, use in routes before controller
  ```
  router.post('/register', validate(registerSchema), register)
  ```

### 6. Authentication

**Issue**: Password stored in plain text
- **Solution**: Hash password with bcrypt before saving:
  ```
  const hashPassword = await bcrypt.hash(password, saltRound)
  ```
**Issue**: Password returned in response
- **Solution**: Don't send password back. Only return safe fields like name and email

**Issue**: No validation of duplicate email registration
- **Solution**: Check if email exists before creating user:
  ```
  const existingEmail = await User.findOne({ where: { email } })
  ```

## Key Concepts Learned
1. MVC Pattern: Model (data), View (JSON response), Controller (business logic)
2. asyncHandler: Wraps async controllers to catch errors automatically
3. Migrations: Version-controlled database schema changes (never use sync() in production)
4. Separation of concerns: Controllers ≠ Routes ≠ Validation ≠ Models
5. Role-based access control: Single User model with role field
5. Security first: Hash passwords, validate input, handle errors properly



