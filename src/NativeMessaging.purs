module NativeMessaging where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Bifunctor (lmap)
import Data.Either (Either)
import Data.Functor.Custom ((>#>))
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Data.String (Pattern(..), contains)
import Effect (Effect)
import Effect.Aff (Aff, attempt)
import Effect.Exception as E

data Error
    = NoComms
    | Unknown

derive instance genericError :: Generic Error _
derive instance eqError :: Eq Error
instance showError :: Show Error where
  show = genericShow

err :: E.Error -> Error
err x
    | contains (Pattern "host not found") (E.message x) = NoComms
    | otherwise                                         = Unknown

foreign import sendNativeMessageImpl :: String -> Json -> Effect (Promise Json)

sendNativeMessage :: forall a. EncodeJson a => String -> a -> Aff (Either Error Json)
sendNativeMessage appName =
    encodeJson >>> sendNativeMessageImpl appName >>> toAffE >>> attempt >#> lmap err

