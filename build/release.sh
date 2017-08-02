set -e
echo "Enter release version: "
read VERSION

echo "Enter message of change:"
read MESSAGE

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 REPLY
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  export SAUCE_BUILD_ID=$VERSION:`date +"%s"`

  # build
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION $MESSAGE"
  npm version $VERSION --message "[release] $VERSION"
  echo
  echo
  echo

  # publish
  echo "git push ..."
  git push
  echo
  echo
  echo
  echo "npm publish ..."
  npm publish
  echo
  echo
  echo
fi
