module Uuid where

import Prelude

import Data.Newtype (class Newtype, un)
import Effect (Effect)

newtype UUID = UUID String

derive instance newtypeUUID :: Newtype UUID _
derive instance eqUUID :: Eq UUID

foreign import createImpl :: Effect String

create :: Effect UUID
create = createImpl <#> UUID

toString :: UUID -> String
toString = un UUID

