let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.13.6-20200226/packages.dhall sha256:3a52562e05b31a7b51d12d5b228ccbe567c527781a88e9028ab42374ab55c0f1

let overrides = {=}

let additions = {=}

in upstream // overrides // additions
