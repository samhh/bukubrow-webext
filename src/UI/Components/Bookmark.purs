module UI.Components.Bookmark (bookmark, Output(..)) where

import Prelude

import Bookmark (LocalBookmark, Link (..), unLink)
import Data.Foldable (intercalate)
import Data.Maybe (Maybe(..))
import Data.String (null)
import Halogen (ClassName(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Tag as Tag
import UI.Utils (thenRender)

type Input =
    { bookmark :: LocalBookmark
    }

type State =
    { bookmark :: LocalBookmark
    }

data Action
    = GenerallyClicked

data Output
    = LinkClicked

bookmark :: forall q m. H.Component q Input Output m
bookmark = H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handleAction }
    }

initialState :: Input -> State
initialState = identity

handleAction :: forall s m. Action -> H.HalogenM s Action () Output m Unit
handleAction GenerallyClicked = H.raise LinkClicked

render :: forall m. State -> H.ComponentHTML Action () m
render { bookmark: bm } =
    let isBookmarklet = case bm.url of
            BookmarkletLink _ -> true
            _                 -> false

    in HH.div [ HP.class_ $ ClassName "bm", HE.onClick $ const GenerallyClicked ]
        [ HH.div_
            [ HH.header_
                [ HH.h1 [ HP.class_ $ ClassName "bm-name" ]
                    [ HH.text "X " -- spaced badge
                    , HH.text bm.title
                    ]
                ]
            , HH.ul [ HP.class_ $ ClassName "bm-tags" ]
                [ HH.text <<< intercalate ", " <<< map Tag.toString $ bm.tags
                ]
            , not (null bm.desc) `thenRender` \_ ->
                HH.p [ HP.class_ $ ClassName "bm-desc" ]
                    [ HH.text bm.desc
                    ]
            , not isBookmarklet `thenRender` \_ ->
                HH.h2 [ HP.class_ $ ClassName "bm-url" ]
                    [ HH.text $ unLink bm.url
                    ]
            ]
        , HH.div_
            [ HH.div [ HP.class_ $ ClassName "bm-ctrls" ]
                [ HH.div_
                    [ HH.button [ HP.class_ $ ClassName "bm-ctrl-btn" ]
                        [ HH.text "e" -- TODO edit icon
                        ]
                    , HH.button [ HP.class_ $ ClassName "bm-ctrl-btn" ]
                        [ HH.text "d" -- TODO delete icon
                        ]
                    ]
                , HH.span [ HP.class_ $ ClassName "bm-ctrl-btn-tooltip" ] [ HH.text "" ]
                ]
            , isBookmarklet `thenRender` \_ ->
                HH.span [ HP.class_ $ ClassName "bmlet-graphic" ]
                    [ HH.text "λ"
                    ]
            ]
        ]

