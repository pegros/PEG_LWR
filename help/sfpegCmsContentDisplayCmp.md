# ![Logo](/media/Logo.png) &nbsp; SFPEG Conditional Container

🚧 This page is still Work In Progress 🚧

## Introduction

This container component provides the ability to display actual richtext of any CMS Content in any page of a site.

## Site Builder Configuration

Forst select one CMS content from the selector and:
* choose whether or not display the content title
* choose a text field to display as content exceprt
* choose a richtext fireld to display as content body 

The 3 elements (title, exceprt, body) are optional but displayed in this order.
Specific CSS may be specified for each individual element.

_to be continued_

## Technical Details

It leverages the standard CMS wire **[getContent](https://developer.salesforce.com/docs/platform/lwc/guide/reference-wire-adapters-delivery-get-content.html)** service to fetch content data.
