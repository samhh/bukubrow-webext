module Config where

import Data.Natural (Natural(..))
import Version (Version(..))

appName :: String
appName = "com.samhh.bukubrow"

minHostVer :: Version
minHostVer = Version (Natural 5) (Natural 0) (Natural 0)

bookmarkSchemaVer :: Int
bookmarkSchemaVer = 3

