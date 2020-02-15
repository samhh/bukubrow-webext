{ name = "bukubrow-webext"
, dependencies =
    [ "console"
    , "effect"
    , "functions"
    , "psci-support"
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}

