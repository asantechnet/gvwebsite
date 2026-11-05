<?php

namespace App;

enum Permission: string
{
    case ViewDashboard = 'dashboard.view';
    case ManageContent = 'content.manage';
    case ManageMessages = 'messages.manage';
    case ManageMedia = 'media.manage';
    case ManageSettings = 'settings.manage';
    case ManageProfile = 'profile.manage';
}
