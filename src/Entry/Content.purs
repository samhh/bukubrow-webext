module Entry.Content where

import Prelude

import AppM (runAppM)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Env (Env, initial)
import Halogen (hoist)
import Halogen.Aff (awaitBody)
import Halogen.VDom.Driver (runUI)
import Settings (getTheme)
import Ui.Content (content)

-- | Get an initial env with anything attached that we want to fetch prior to
-- | the page rendering.
getEnv :: Aff Env
getEnv = getTheme <#> case _ of
    Just x   -> initial { prefs { theme = x } }
    Nothing  -> initial

main :: Effect Unit
main = launchAff_ do
    env <- getEnv
    let root = hoist (runAppM env) content
    awaitBody >>= runUI root unit

