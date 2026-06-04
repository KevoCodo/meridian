# API Standards

## Validation

All request bodies must be validated with Pydantic schemas. Route handlers should not parse untyped dictionaries for domain inputs.

Validation rules should live near API schemas when they describe transport contracts, and in services when they describe business rules.

## Response Formatting

API responses should use camelCase field names externally, even when database columns use snake_case.

Collection responses should use a consistent envelope:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 0
  }
}
```

Single-resource responses may return the resource object directly unless a broader envelope becomes necessary.

## Error Handling

Errors should use consistent JSON structure:

```json
{
  "error": {
    "code": "resource_not_found",
    "message": "Resource not found",
    "details": {}
  }
}
```

Expected domain errors should be raised from services and translated at the API boundary. Unexpected errors should not leak internal implementation details.

## Pagination

Default pagination:

- `page`: starts at 1
- `pageSize`: defaults to 25
- Maximum `pageSize`: 100

Offset pagination is acceptable for early phases. Cursor pagination can be introduced for high-volume activity streams later.

## Filtering

Filters should be explicit query parameters. Examples:

- `status=active`
- `clientId=<uuid>`
- `projectId=<uuid>`
- `createdAfter=<timestamp>`

Workspace scoping is not a user-provided filter. It should come from the authenticated context once authentication exists.

## Sorting

Sort parameters should follow:

- `sort=createdAt`
- `sort=-createdAt`

A leading `-` indicates descending order. Unsupported sort fields should return a validation error.

## Versioning

The first feature APIs should live under an explicit version prefix such as `/api/v1`. The Phase 0A `/health` endpoint remains unversioned for infrastructure use.
