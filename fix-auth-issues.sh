#!/bin/bash

# Fix all auth.getUser() issues in store files
for file in src/stores/*.ts; do
  if grep -q "api.query.*api.client.auth.getUser()" "$file"; then
    echo "Fixing $file..."
    # Replace the auth pattern
    sed -i '' 's/const userResult = await api.query(/const { data: userData, error: userError } = await api.client.auth.getUser()\n\n        \/\/ Remove the old api.query lines/g' "$file"
    sed -i '' '/() => api.client.auth.getUser(),/,/)/d' "$file"
    sed -i '' 's/if (isApiError(userResult) || !userResult.data.user)/if (userError || !userData.user)/g' "$file"
    sed -i '' 's/userResult.data.user.id/userData.user.id/g' "$file"
  fi
done

echo "Auth issues fixed!"