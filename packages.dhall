let upstream =
      https://github.com/purescript/package-sets/releases/download/psc-0.14.0-20210401/packages.dhall sha256:aa77595c1eeceeda15f9c377b4fd1b2aacf80c3afd98e8712aeadff2afe26816

let overrides = {=}

let additions = {=}

in  upstream // overrides // additions
