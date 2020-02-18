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
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}

