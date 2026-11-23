@extends('errors.layout')

@section('title', 'Page not found')
@section('code', '404')
@section('heading', 'We could not find that page')
@section('message', 'The link may be out of date, or the page may have been moved or removed.')
@section('actions')
    <a class="btn" href="{{ url('/widgets') }}">Your widgets</a>
    <a class="btn btn-ghost" href="{{ url('/') }}">Home</a>
@endsection
