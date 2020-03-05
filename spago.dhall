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
  , "generics-rep"
  , "halogen"
  , "newtype"
  , "profunctor-lenses"
  , "psci-support"
  , "record"
  , "spec"
  , "spec-discovery"
  , "spec-quickcheck"
  , "stringutils"
  , "typelevel-prelude"
  , "versions"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
