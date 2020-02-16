{ name = "bukubrow-webext"
, dependencies =
    [ "aff"
    , "aff-promise"
    , "assert"
    , "console"
    , "effect"
    , "foreign"
    , "functions"
    , "psci-support"
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}

