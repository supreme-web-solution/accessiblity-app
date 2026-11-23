@extends('errors.layout')

@section('title', 'Not allowed')
@section('code', '403')
@section('heading', 'This is not available to your account')
@section('message', 'That widget belongs to another account, or you do not have permission to open it. Check the list of your own widgets.')
@section('actions')
    <a class="btn" href="{{ url('/widgets') }}">Go to your widgets</a>
    <a class="btn btn-ghost" href="{{ url('/') }}">Home</a>
@endsection
