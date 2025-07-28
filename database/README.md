# Database Schema and Scripts

This folder contains database-related files including schemas and SQL scripts.

## Files

- `schema_my.sql` - MySQL database schema
- `schema_pg.sql` - PostgreSQL database schema  
- `query.sql` - Common SQL queries and examples

## Database Setup

### MySQL
```bash
mysql -u username -p < schema_my.sql
```

### PostgreSQL
```bash
psql -U username -d database_name -f schema_pg.sql
```

## Notes

- Choose the appropriate schema file based on your database system
- Make sure to configure your database connection in the backend configuration
- The query.sql file contains useful example queries for testing
