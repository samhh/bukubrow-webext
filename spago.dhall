{ name = "bukubrow-webext"
, dependencies =
  [ "aff"
  , "aff-promise"
  , "argonaut-codecs"
  , "argonaut-core"
  , "console"
  , "effect"
  , "filterable"
  , "functions"
  , "halogen"
  , "newtype"
  , "profunctor-lenses"
  , "psci-support"
  , "record"
  , "spec"
  , "spec-discovery"
  , "spec-quickcheck"
  , "strings"
  , "stringutils"
  , "typelevel-prelude"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
