module Config where

import Version (Version, fromSigned)

appName :: String
appName = "com.samhh.bukubrow"

minHostVer :: Version
minHostVer = fromSigned 5 0 0

bookmarkSchemaVer :: Int
bookmarkSchemaVer = 3

