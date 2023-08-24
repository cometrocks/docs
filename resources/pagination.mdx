---
title: '📃 Pagination'
description: 'Efficiently navigate and retrieve data in manageable chunks using Comet API’s pagination mechanism.'
---
When dealing with extensive datasets, it's essential to retrieve data in manageable chunks or "pages". This mechanism, known as pagination, ensures efficient data retrieval and improved performance.

### Pagination Input

In the Comet API, the typical input parameters for pagination are:

- `first`: Number of records to fetch after the provided cursor.
- `after`: Cursor to start fetching records after.
- `last`: Number of records to fetch before the provided cursor.
- `before`: Cursor to start fetching records before.

It's crucial to note that only one of `first/after` or `last/before` should be provided in a single query. If no pagination parameters are provided, the default behavior is to retrieve the first 10 records.

```graphql
input Pagination {
	first: Int
	after: String
	last: Int
	before: String
}
```

### Connection Model

The Comet API often uses the "Connection" model for paginated lists. A typical connection might look like:

```graphql
type ProductConnection {
    pageInfo: PageInfo
    nodes: [Product!]!
}
```

### PageInfo

The `pageInfo` field provides essential details about the current page:

```graphql
type PageInfo {
	startCursor: String
	endCursor: String
	hasNextPage: Boolean
	hasPreviousPage: Boolean
	totalCount: Int!
}
```

- `startCursor`: The cursor for the first record on the current page.
- `endCursor`: The cursor for the last record on the current page.
- `hasNextPage`: A boolean indicating if there are more records after the current page.
- `hasPreviousPage`: A boolean indicating if there are records before the current page.
- `totalCount`: The total number of records.

### Example Usage

To fetch the first 10 products:

```graphql
query {
  productFind(pagination: { first: 10 }) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
      totalCount
    }
    nodes {
      id
      name
      description
      # Other fields here
    }
  }
}
```

To fetch the next 10 products after a specific cursor:

```graphql
query {
  productFind(pagination: { first: 10, after: "prd_ZJQXk_cZFF-LWPKt" }) {
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
      totalCount
    }
    nodes {
      id
      name
      description
      # Other fields here
    }
  }
}
```

Always ensure to use pagination effectively in the Comet API to manage data retrieval and ensure optimal performance. By understanding and implementing pagination, you can ensure efficient data retrieval and a better user experience.

