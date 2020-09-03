ENVIRONMENT=$1
VERSION="$(node -p -e "require('./package.json').version")-$BUILD_NUMBER"
sed -i "s/%VERSION%/$VERSION/g" ./src/environments/environment.$ENVIRONMENT.ts
npm install
npm run build:$ENVIRONMENT
git tag -a $VERSION -m 'Version - $VERSION'
