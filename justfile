# Run pnpm
@pnpm *args:
    pnpm -C src {{args}}

# Run linter on all .ts files in the src directory
@lint: 
    pnpm -C src run lint

# Run prettier
@prettier-format:
    pnpm -C src run prettier:format

# Check code styles
@prettier-check:
    pnpm -C src run prettier:check

# Test code
@test:
    pnpm -C src run test
