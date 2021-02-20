module Ui.Components.Onboarding (onboarding) where

import Prelude

import Data.Maybe (Maybe(..))
import Halogen (ClassName(..))
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP

data OS
    = Linux
    | MacOS
    | Windows

type State =
    { os :: Maybe OS
    }

data Action
    = SetOS OS

onboarding :: forall q i o m. H.Component HH.HTML q i o m
onboarding = H.mkComponent
    { initialState
    , render
    , eval: H.mkEval H.defaultEval { handleAction = handler }
    }

initialState :: forall i. i -> State
initialState = const { os: Nothing }

handler :: forall o m. Action -> H.HalogenM State Action () o m Unit
handler = case _ of
    SetOS os -> H.modify_ \s -> s { os = Just os }

render :: forall m. State -> H.ComponentHTML Action () m
render s =
    let
        setOS a = const $ Just $ SetOS a

        content = case s.os of
            Just os -> instructions os
            Nothing ->
                HH.div_
                    [ HH.fieldset_
                        [ HH.legend_
                            [ HH.text "Which operating system are you using?" ]
                        , HH.div [ HP.class_ $ ClassName "onboarding-selection-buttons" ]
                            [ HH.button [ HE.onClick $ setOS Linux ]
                                [ HH.text "Linux" ]
                            , HH.button [ HE.onClick $ setOS MacOS ]
                                [ HH.text "MacOS" ]
                            , HH.button [ HE.onClick $ setOS Windows ]
                                [ HH.text "Windows" ]
                            ]
                        ]
                    ]
    in
        HH.div [ HP.class_ $ ClassName "onboarding-wrapper" ]
            [ welcome
            , content
            ]

welcome :: forall a b. HH.HTML a b
welcome =
    HH.div_
        [ HH.header_
            [ HH.h1 [ HP.class_ $ ClassName "onboarding-heading" ]
                [ HH.text "Welcome to Bukubrow" ]
            , HH.h2 [ HP.class_ $ ClassName "onboarding-subheading" ]
                [ HH.text "Communication with the host couldn't be achieved." ]
            ]
        , HH.img [ HP.src "./img/zap-off.svg", HP.class_ $ ClassName "onboarding-hero" ]
        ]

instructions :: forall a b. OS -> HH.HTML a b
instructions os =
    let
        hostHref = "https://github.com/SamHH/bukubrow-host"
        winHref = "https://github.com/SamHH/bukubrow-host/issues/5"
    in
        HH.div_ case os of
            Windows ->
                [ HH.p_
                    [ HH.text "Unfortunately, Windows is not yet formally supported by Bukubrow." ]
                , HH.p_
                    [ HH.text "If you'd like to offer your help in achieving support, or otherwise simply +1 it as a feature request, please do so "
                    , HH.a [ HP.href winHref, HP.target "_blank" ]
                        [ HH.text "here" ]
                    , HH.text "."
                    ]
                ]
            otherwise ->
                [ HH.p_
                    [ HH.text "Installing the host and registering it with your browser is required to allow Bukubrow to talk to Buku." ]
                , HH.p_
                    [ HH.text "Please find a precompiled host and instructions at "
                    , HH.a [ HP.href hostHref, HP.target "_blank" ]
                        [ HH.text "samhh/bukubrow-host" ]
                    , HH.text "."
                    ]
                ]

