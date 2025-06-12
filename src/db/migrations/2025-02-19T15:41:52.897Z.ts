import type { Kysely } from "kysely";
import { notNull, primaryKey } from "../queryHelper.ts";

// deno-lint-ignore no-explicit-any
export async function up(db: Kysely<any>) {
    await db.schema.createTable('user')
        .addColumn('id', 'serial', primaryKey)         // Unique identifier for each user
        .addColumn('name', 'char(255)', notNull)        // User's chosen display name
        .addColumn('email', 'char(255)', notNull)       // User's email address for communication and login
        .addColumn('emailVerified', 'boolean', notNull) // Whether the user's email is verified
        .addColumn('image', 'varchar')                  // User's image url
        .addColumn('createdAt', 'date', notNull)        // Timestamp of when the user account was created
        .addColumn('updatedAt', 'date', notNull)        // Timestamp of the last update to the user's information
        .execute()

    await db.schema.createTable('session')
        .addColumn('id', 'serial', primaryKey)     // Unique identifier for each session
        .addColumn('userId', 'integer', notNull) // The id of the user
        .addForeignKeyConstraint('session_user_id_foreign', ['userId'], 'user', ['id'])
        .addColumn('token', 'varchar', notNull)     // The unique session token
        .addColumn('expiresAt', 'date', notNull)    // The time when the session expires
        .addColumn('ipAddress', 'char(255)')        // The IP address of the device
        .addColumn('userAgent', 'varchar')          // The user agent information of the device
        .addColumn('createdAt', 'date', notNull)    // Timestamp of when the verification request was created
        .addColumn('updatedAt', 'date', notNull)    // Timestamp of when the verification request was updated
        .execute()

    await db.schema.createTable('account')
        .addColumn('id', 'serial', primaryKey) // Unique identifier for each account
        .addColumn('userId', 'integer', notNull) // The id of the user
        .addForeignKeyConstraint('account_user_id_foreign', ['userId'], 'user', ['id'])
        .addColumn('accountId', 'varchar', notNull) // The id of the account as provided by the SSO or equal to userId for credential accounts
        .addColumn('providerId', 'varchar', notNull) // The id of the provider
        .addColumn('accessToken', 'varchar') // The access token of the account. Returned by the provider
        .addColumn('refreshToken', 'varchar') // The refresh token of the account. Returned by the provider
        .addColumn('accessTokenExpiresAt', 'date') // The time when the verification request expires
        .addColumn('refreshTokenExpiresAt', 'date') // The time when the verification request expires
        .addColumn('scope', 'varchar') // The scope of the account. Returned by the provider
        .addColumn('idToken', 'varchar') // The id token returned from the provider
        .addColumn('password', 'varchar') // The password of the account. Mainly used for email and password authentication
        .addColumn('createdAt', 'date', notNull) // Timestamp of when the verification request was created
        .addColumn('updatedAt', 'date', notNull) // Timestamp of when the verification request was updated
        .execute()

    await db.schema.createTable('verification')
        .addColumn('id', 'serial', primaryKey)     // Unique identifier for each verification
        .addColumn('identifier', 'varchar', notNull)    // The identifier for the verification request
        .addColumn('value', 'varchar', notNull)     // The value to be verified
        .addColumn('expiresAt', 'date', notNull)    // The time when the verification request expires
        .addColumn('createdAt', 'date', notNull)    // Timestamp of when the verification request was created
        .addColumn('updatedAt', 'date', notNull)    // Timestamp of when the verification request was updated
        .execute()
}

// deno-lint-ignore no-explicit-any
export async function down(db: Kysely<any>) {
    await db.schema.dropTable('verification').execute()
    await db.schema.dropTable('account').execute()
    await db.schema.dropTable('session').execute()
    await db.schema.dropTable('user').execute()
}