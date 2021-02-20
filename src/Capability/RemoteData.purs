module Capability.RemoteData where

import Prelude

import Bookmark (RemoteBookmark)
import Bukubrow (HostFailure)
import Data.Either (Either)
import Data.Maybe (Maybe)
import Halogen (HalogenM, lift)

class Monad m <= RemoteData m where
    checkConnection :: m (Either HostFailure Unit)
    getRemoteBookmarks :: m (Maybe (Array RemoteBookmark))

instance remoteDataHalogenM :: RemoteData m => RemoteData (HalogenM a b c d m) where
    checkConnection = lift checkConnection
    getRemoteBookmarks = lift getRemoteBookmarks

