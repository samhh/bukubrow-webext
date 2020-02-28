{ name = "bukubrow-webext"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "effect"
  , "foreign"
  , "foreign-generic"
  , "functions"
  , "generics-rep"
  , "halogen"
  , "psci-support"
  , "record"
  , "spec"
  , "spec-discovery"
  , "spec-quickcheck"
  , "typelevel-prelude"
  , "uuid"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
