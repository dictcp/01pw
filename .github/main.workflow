workflow "New workflow" {
  on = "push"
  resolves = ["new-action"]
}

action "GitHub Action for Docker" {
  uses = "actions/docker/cli@86ab5e854a74b50b7ed798a94d9b8ce175d8ba19"
  args = "build -t dictcp/01pw ."
}

action "new-action" {
  uses = "owner/repo/path@ref"
  needs = ["GitHub Action for Docker"]
}
