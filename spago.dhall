{ name = "bukubrow-webext"
, dependencies =
    [ "aff"
    , "aff-promise"
    , "assert"
    , "console"
    , "effect"
    , "foreign"
    , "functions"
    , "generics-rep"
    , "psci-support"
    , "record"
    , "typelevel-prelude"
    , "uuid"
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}

