module NativeMessaging where

import Prelude

import Control.Promise (Promise, toAffE)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Effect (Effect)
import Effect.Aff (Aff)

foreign import sendNativeMessageImpl :: String -> Json -> Effect (Promise Json)

sendNativeMessage :: forall a. EncodeJson a => String -> a -> Aff Json
sendNativeMessage appName = encodeJson >>> sendNativeMessageImpl appName >>> toAffE

