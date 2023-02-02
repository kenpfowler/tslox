# Run pnpm
@pnpm *args:
    pnpm -C src {{args}}

# Run linter on all .ts files in the src directory
@lint: 
    pnpm -C src run lint