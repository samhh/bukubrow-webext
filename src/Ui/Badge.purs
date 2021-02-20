module Ui.Badge (badge, Rank(..)) where

import Prelude

import Css (modifierM)
import Data.Maybe (Maybe(..))
import Halogen (ClassName(..))
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

data Rank
    = Primary
    | Secondary
    | None

cm :: Rank -> Maybe String
cm Primary   = Just "primary"
cm Secondary = Just "secondary"
cm None      = Nothing

cs :: Rank -> Array ClassName
cs = modifierM (ClassName "badge") cm

badge :: forall a b. Rank -> HH.HTML a b
badge x = HH.span [ HP.classes $ cs x ] []

