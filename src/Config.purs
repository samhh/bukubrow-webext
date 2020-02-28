module Config where

import Data.List (List(..))
import Data.Version (Version, version)

appName :: String
appName = "com.samhh.bukubrow"

minHostVer :: Version
minHostVer = version 5 0 0 Nil Nil

bookmarkSchemaVer :: Int
bookmarkSchemaVer = 3

