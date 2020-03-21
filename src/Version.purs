module Version where

import Prelude

import Data.Function (on)
import Data.Functor.Custom ((>#>))
import Data.Generic.Rep (class Generic)
import Data.Generic.Rep.Show (genericShow)
import Data.Lens (Prism', preview, prism', review)
import Data.Maybe (Maybe(..))
import Data.Natural (Natural, fromString, sign)
import Data.String (Pattern(..), joinWith, split)
import Data.Traversable (sequence)
import Friendly (class Friendly, showf)
import Test.QuickCheck (class Arbitrary, arbitrary)

data Version = Version Natural Natural Natural

instance showVersion :: Show Version where
    show = review $ versionStringPrism show

instance friendlyVersion :: Friendly Version where
    showf = review $ versionStringPrism showf

instance eqVersion :: Eq Version where
    eq = eq `on` review versionArrNatPrism

instance arbitraryVersion :: Arbitrary Version where
    arbitrary = Version <$> arbitrary <*> arbitrary <*> arbitrary

versionArrNatPrism :: Prism' (Array Natural) Version
versionArrNatPrism = prism' to from
    where
        from :: Array Natural -> Maybe Version
        from [x, y, z] = Just $ Version x y z
        from _ = Nothing

        to :: Version -> Array Natural
        to (Version x y z) = [x, y, z]

versionStringPrism :: (Natural -> String) -> Prism' String Version
versionStringPrism f = prism' (toVia f) from
    where
        from :: String -> Maybe Version
        from = split (Pattern ".") >>> (map fromString >>> sequence) >=> preview versionArrNatPrism

        toVia :: (Natural -> String) -> Version -> String
        toVia g = review versionArrNatPrism >#> g >>> joinWith "."

fromSigned :: Int -> Int -> Int -> Version
fromSigned x y z = Version (sign x) (sign y) (sign z)

data Outdated
    = FirstOutdated
    | SecondOutdated

derive instance eqOutdated :: Eq Outdated
derive instance genericOutdated :: Generic Outdated _
instance showOutdated :: Show Outdated where
  show = genericShow

data Compatible
    = Okay
    | Incompatible Outdated
    | Corrupt

derive instance eqCompatible :: Eq Compatible
derive instance genericCompatible :: Generic Compatible _
instance showCompatible :: Show Compatible where
  show = genericShow

compat :: Version -> Version -> Compatible
compat (Version a b c) (Version x y z)
    | x > a     = Incompatible FirstOutdated
    | x < a     = Incompatible SecondOutdated
    | y < b     = Incompatible SecondOutdated
    | z < c     = Incompatible SecondOutdated
    | otherwise = Okay

