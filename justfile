# Run pnpm
@pnpm *args:
    pnpm -C src {{args}}

# Run tslox REPL
@start:
    pnpm -C src run start

# Run linter on all .ts files in the src directory
@lint: 
    pnpm -C src run lint

# Run prettier
@format:
    pnpm -C src run prettier:format

# Check code styles
@check:
    pnpm -C src run prettier:check

# Test code
@test:
    pnpm -C src run test
