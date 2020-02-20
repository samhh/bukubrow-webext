module Foreign.Custom where

import Data.Maybe (Maybe(..))
import Foreign (Foreign, isNull, unsafeFromForeign)

unsafeFromNullable :: forall a. Foreign -> Maybe a
unsafeFromNullable x = if isNull x then Nothing else Just (unsafeFromForeign x)

