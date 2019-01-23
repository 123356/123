set desDir=%1
set srcInDir=%2

set srcDir=%CD%

#rem copy Cursors folder

xcopy %srcDir%\YWWeb\AmazeUI-2.7.2\*.* %srcDir%\%desDir%\AmazeUI-2.7.2\   /s /e /y
xcopy %srcDir%\YWWeb\bin\*.dll %srcDir%\%desDir%\bin\  /y
xcopy %srcDir%\YWWeb\bin\roslyn\*.* %srcDir%\%desDir%\bin\roslyn\  /s  /e /y
xcopy %srcDir%\YWWeb\bin\Mongo\*.* %srcDir%\%desDir%\bin\Mongo\  /y
xcopy %srcDir%\YWWeb\bin\Cache\*.* %srcDir%\%desDir%\bin\Cache\  /s  /e /y

xcopy %srcDir%\YWWeb\Content\*.* %srcDir%\%desDir%\Content\ /s /e /y
xcopy %srcDir%\YWWeb\HaiKang\*.* %srcDir%\%desDir%\HaiKang\ /s /e /y
xcopy %srcDir%\YWWeb\jquery-easyui-1.4.5\*.* %srcDir%\%desDir%\jquery-easyui-1.4.5\ /s /e /y
xcopy %srcDir%\YWWeb\json\*.* %srcDir%\%desDir%\json\ /s /e /y
xcopy %srcDir%\YWWeb\Media\*.* %srcDir%\%desDir%\Media\ /s /e /y
xcopy %srcDir%\YWWeb\Views\*.* %srcDir%\%desDir%\Views\ /s /e /y
xcopy %srcDir%\YWWeb\Areas\EnergyManage\Views\*.* %srcDir%\%desDir%\Areas\EnergyManage\Views\ /s /e /y

xcopy %srcDir%\YWWeb\*.html %srcDir%\%desDir%\ /y
xcopy %srcDir%\YWWeb\Web.config %srcDir%\%desDir%\ /y
xcopy %srcDir%\YWWeb\Global.asax %srcDir%\%desDir%\ /y
xcopy %srcDir%\YWWeb\DLL\Log4net4.0\log4net.config %srcDir%\%desDir%\bin\ /y


