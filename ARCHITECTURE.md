Architecture
===

## _WIP_

This branch is a WIP.

- Consider a [monorepo](https://github.com/purescript/spago#monorepo)/split approach a la Haskell apps

## Language & Paradigm

The WebExtension is written in PureScript, a pure functional language that compiles down to JavaScript, utilising [Halogen](https://github.com/purescript-halogen/purescript-halogen) for UI rendering.

It used to be written in a functional style of TypeScript, however limitations of the language and the author's interest in PureScript led to this rewrite.

## Communication

Data is fetched from the host via native messaging. This data is presently cached in Local Storage, however this needs revisiting.

## Getting Started

As is the norm for PureScript projects, Spago is the build tool of choice. The only scripts defined in the makefile related to building are those for bundling Spago/PureScript's output for the browser.

A typical development workflow is to run `make -s bundle-dev`, `spago build -w`, and `spago test -w` simultaneously.


