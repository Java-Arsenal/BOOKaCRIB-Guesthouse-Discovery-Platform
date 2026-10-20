#!/bin/bash

echo "==========================================="
echo " 🚀 BOOKaCRIB Environment & Connection Test "
echo "==========================================="

echo -e "\n🔍 Checking Development Engines..."
echo -n "Node.js version: " && node -v || echo "❌ Missing"
echo -n "Java version:   " && javac -version || echo "❌ Missing"

echo -e "\n🌿 Checking Local Git Tracking..."
echo -n "Current Branch:  " && git branch --show-current
echo -n "Configured User: " && git config user.name
echo -n "Configured Email:" && git config user.email

echo -e "\n🌐 Testing Secure Connection to GitHub..."
ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"
if [ $? -eq 0 ]; then
    echo "✅ GitHub SSH Connection: Success!"
else
    echo "🔄 Testing HTTPS API Connection..."
    curl -I https://github.com 2>&1 | grep -q "HTTP/"
    if [ $? -eq 0 ]; then
        echo "✅ GitHub HTTPS Connection: Success! Repository is accessible."
    else
        echo "❌ GitHub Connection: Failed. Please check your network or token."
    fi
fi

echo -e "\n📥 Fetching Latest Code Changes From GitHub..."
git fetch --all

echo "==========================================="
echo "   🎉 Checklist Complete! Environment Ready. "
echo "==========================================="




