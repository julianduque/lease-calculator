# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.2.0](https://github.com/ErezNagar/lease-calculator/compare/v1.1.0...v1.2.0) - 27/7/2020

### Added

 - Support for different taxation methods:
    Tax levied on monthly payment (most states)
    Tax levied on selling/sales price (Virginia)
    Tax levied on total lease ppayment (New York, New Jersy, Minnesota, Ohio, Georgia)

## [1.1.0](https://github.com/ErezNagar/lease-calculator/compare/v1.0.1...v1.1.0) - 29/6/2020

### Added

- Acquisition and disposition fee support for 35 manufacturers:
    calculate() now accepts a `make` field for calculating manufacturer-based fees.
- getAcquisitionFeeValue(), returns acquisition fee value
- getDispositionFeeValue(), returns disposition fee value

## [1.0.1](https://github.com/ErezNagar/lease-calculator/compare/v1.0.0...v1.0.1) - 27/4/2020

### Fixed

- Removed required support for the experimental classProperties syntax
- Fixed package.json/main property

## [1.0.0](https://github.com/ErezNagar/lease-calculator/compare/v0.1.0...v1.0.0) - 27/4/2020

- Version official version

## [0.1.0](https://github.com/ErezNagar/lease-calculator/releases/tag/v0.1.0) - 14/4/2020

Initial version
