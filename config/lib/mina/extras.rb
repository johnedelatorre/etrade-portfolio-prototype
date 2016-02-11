require 'erb'

task :setup => :environment do
  queue! %[mkdir -p "#{deploy_to}/shared/log"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/log"]

  queue! %[mkdir -p "#{deploy_to}/shared/config"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/config"]

  queue! %[mkdir -p "#{deploy_to}/shared/bower_components"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/bower_components"]

  queue! %[mkdir -p "#{deploy_to}/shared/node_modules"]
  queue! %[chmod g+rx,u+rwx "#{deploy_to}/shared/node_modules"]
end

def upload_template(desc, tpl, destination)
  contents = parse_template(tpl)
  queue %{echo "-----> Put #{desc} file to #{destination}"}
  queue %{echo "#{contents}" > #{destination}}
  queue check_exists(destination)
end

def parse_template(file)
  erb("#{config_templates_path}/#{file}.erb").gsub('"','\\"').gsub('`','\\\\`').gsub('$','\\\\$')
end

def check_response
  'then echo "----->   SUCCESS"; else echo "----->   FAILED"; fi'
end

def check_exists(destination)
  %{if [[ -s "#{destination}" ]]; #{check_response}}
end

def check_symlink(destination)
  %{if [[ -h "#{destination}" ]]; #{check_response}}
end

def run_build_process(build_system)
  queue! 'source ~/.nvm/nvm.sh; nvm use v0.10.35; npm install'
  # queue! "source ~/.bash_profile; bower install; #{build_system} build"
end
