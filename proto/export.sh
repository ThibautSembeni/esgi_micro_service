# !bin/sh

buf generate
buf export . --output ../user-api/src/proto
buf export . --output ../auth-api/src/proto
buf export . --output ../account-api/src/proto
buf export . --output ../transaction-api/src/proto