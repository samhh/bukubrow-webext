module Bukubrow where

import Prelude

import Bookmark (BookmarkId, RemoteBookmark, RemoteBookmarkUnsaved)
import Config (appName, minHostVer)
import Data.Argonaut.Core (Json)
import Data.Argonaut.Decode.Custom (Decoder', decodeJson')
import Data.Argonaut.Encode (class EncodeJson, encodeJson)
import Data.Array (length)
import Data.Either (Either(..), hush)
import Data.Foldable (class Foldable)
import Data.Functor.Custom ((>#>))
import Data.Generic.Rep (class Generic)
import Data.Show.Generic (genericShow)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import NativeMessaging (Error(..))
import NativeMessaging as NM
import Result (Result, fromMaybe)
import Version (Compatible(..), Outdated(..), Version, compat)

sendNativeMessage :: forall a. EncodeJson (Shaped a) => Shaped a -> Aff (Either Error Json)
sendNativeMessage = NM.sendNativeMessage appName

sendNativeMessage' :: forall a. EncodeJson (Shaped a) => Shaped a -> Aff (Maybe Json)
sendNativeMessage' = sendNativeMessage >#> hush

data Method
    = Check
    | Get
    | Insert
    | Update
    | Delete

instance encodeMethod :: EncodeJson Method where
    encodeJson = bukubrowMethod >>> encodeJson

bukubrowMethod :: Method -> String
bukubrowMethod Check  = "OPTIONS"
bukubrowMethod Get    = "GET"
bukubrowMethod Insert = "POST"
bukubrowMethod Update = "PUT"
bukubrowMethod Delete = "DELETE"

type Shaped a =
    { method :: Method
    , data :: Maybe a
    }

shape :: forall a. Method -> a -> Shaped a
shape x y = { method: x, data: Just y }

shape' :: Method -> Shaped Void
shape' x = { method: x, data: Nothing }

type GetResponse =
    { bookmarks :: Array RemoteBookmark
    , moreAvailable :: Boolean
    }

get :: Aff (Maybe (Array RemoteBookmark))
get = f [] where
    f :: Array RemoteBookmark -> Aff (Maybe (Array RemoteBookmark))
    f xs = do
        res <- sendNativeMessage' $ shape Get { offset: length xs }
        let decoded = res >>= (decodeJson' :: Decoder' GetResponse)
        case decoded of
            Nothing -> pure Nothing
            Just d  -> do
                let ys = xs <> d.bookmarks
                case d.moreAvailable of
                    false -> pure $ Just ys
                    true  -> f ys

type CheckResponse =
    { binaryVersion :: Version
    }

data HostFailure
    = HostOutdated
    | WebExtOutdated
    | NoHostComms
    | UnknownError

derive instance genericHostFailure :: Generic HostFailure _
derive instance eqHostFailure :: Eq HostFailure
instance showHostFailure :: Show HostFailure where
  show = genericShow

commsError :: Error -> HostFailure
commsError NoComms = NoHostComms
commsError Unknown = UnknownError

compatible :: Compatible -> Either HostFailure Unit
compatible Compatible                    = Right unit
compatible Corrupt                       = Left UnknownError
compatible (Incompatible FirstOutdated)  = Left WebExtOutdated
compatible (Incompatible SecondOutdated) = Left HostOutdated

check :: Aff (Either HostFailure Unit)
check = do
    res <- sendNativeMessage $ shape' Check
    pure case res of
        Left e -> Left $ commsError e
        Right json -> do
            let decoded = (decodeJson' :: Decoder' CheckResponse) json <#> _.binaryVersion
            case decoded of
                Just v -> compatible $ compat minHostVer v
                Nothing -> Left UnknownError

type BareResponse =
    { success :: Result
    }

decodeResult :: Maybe Json -> Result
decodeResult = map ((decodeJson' :: Decoder' BareResponse) >#> _.success) >>> fromMaybe

insert :: forall f. Foldable f => EncodeJson (f RemoteBookmarkUnsaved) => f RemoteBookmarkUnsaved -> Aff Result
insert = { bookmarks: _ } >>> shape Insert >>> sendNativeMessage' >#> decodeResult

update :: forall f. Foldable f => EncodeJson (f RemoteBookmark) => f RemoteBookmark -> Aff Result
update = { bookmarks: _ } >>> shape Update >>> sendNativeMessage' >#> decodeResult

delete :: forall f. Foldable f => EncodeJson (f BookmarkId) => f BookmarkId -> Aff Result
delete = { bookmark_ids: _ } >>> shape Delete >>> sendNativeMessage' >#> decodeResult

