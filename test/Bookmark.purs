module Test.Bookmark where

import Prelude

import Bookmark (localTags, remoteTags)
import Effect (Effect)
import Test.Assert (assertEqual)

main :: Effect Unit
main = do
    testLocalTags
    testRemoteTags

testLocalTags :: Effect Unit
testLocalTags = do
    assertEqual { expected: [], actual: localTags "" }
    assertEqual { expected: [], actual: localTags "," }
    assertEqual { expected: [], actual: localTags ",," }
    assertEqual { expected: ["a", "b"], actual: localTags "a,b" }
    assertEqual { expected: ["a", "b"], actual: localTags "a,b," }
    assertEqual { expected: ["a", "b"], actual: localTags ",a,b" }
    assertEqual { expected: ["a", "b"], actual: localTags ",a,b," }

testRemoteTags :: Effect Unit
testRemoteTags = do
    assertEqual { expected: ",", actual: remoteTags [] }
    assertEqual { expected: ",a,", actual: remoteTags ["a"] }
    assertEqual { expected: ",a,b,", actual: remoteTags ["a", "b"] }

