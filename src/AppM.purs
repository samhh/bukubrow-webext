module AppM where

import Prelude

import Bukubrow (check, get)
import Capability.RemoteData (class RemoteData)
import Control.Monad.Reader (class MonadAsk, ReaderT, asks, runReaderT)
import Data.Newtype (class Newtype)
import Effect.Aff (Aff)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Env (Env)
import Type.Equality as TE

newtype AppM a = AppM (ReaderT Env Aff a)

derive instance newtypeAppM :: Newtype (AppM a) _
derive newtype instance functorAppM :: Functor AppM
derive newtype instance applyAppM :: Apply AppM
derive newtype instance applicativeAppM :: Applicative AppM
derive newtype instance bindAppM :: Bind AppM
derive newtype instance monadAppM :: Monad AppM
derive newtype instance monadEffectAppM :: MonadEffect AppM
derive newtype instance monadAffAppM :: MonadAff AppM

instance monadAskAppM :: TE.TypeEquals e Env => MonadAsk e AppM where
    ask = AppM $ asks TE.from

runAppM :: Env -> AppM ~> Aff
runAppM e (AppM m) = runReaderT m e

instance remoteDataAppM :: RemoteData AppM where
    checkConnection = liftAff check
    getRemoteBookmarks = liftAff get

