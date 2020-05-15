#! /bin/bash

ENV=$1

main() {
    case $ENV in
        dev)
            IMAGE_TAG=dev-$(date +%Y%m%d-%H%M%S)
            IMAGE_REPO=docker.artifactory.booking.com/projects/$USER/bturchik/radial-chart
        ;;
        dqs)
            IMAGE_TAG=dqs-$(date +%Y%m%d-%H%M%S)
            IMAGE_REPO=docker.artifactory.booking.com/projects/bturchik/radial-chart
        ;;
        prod)
            IMAGE_TAG=prod-$(date +%Y%m%d-%H%M%S)
            IMAGE_REPO=docker.artifactory.booking.com/projects/bturchik/radial-chart
        ;;
        *)
            error "Usage: ./deploy <dev|dqs|prod>"
    esac

    check_context
    set -e -x
    yarn build
    docker build --pull . -t $IMAGE_REPO:$IMAGE_TAG
    docker push $IMAGE_REPO:$IMAGE_TAG
    sed "s|IMAGE_REPO|\"$IMAGE_REPO\"|g; \
         s|IMAGE_TAG|\"$IMAGE_TAG\"|g" \
        kubernetes/application-$ENV.yaml |
        kubectl apply -f -
}

check_context() {
    which bkcloud > /dev/null || error "bkcloud is not installed"
    which jq      > /dev/null || error "jq is not installed"

    bkcloud context -o json | jq '.login.status' | grep -q "logged in" ||
        error "Not logged into bkcloud."

    [ "$(bkcloud context -o json | jq '.inSync')" = "true" ] ||
        error "bkcloud context is not in sync."

    [ "$(bkcloud context -o json | jq '.bkcontext.context.project')" = '"bturchik"' ] ||
        error "Incorrect bkcloud project. Expected 'bturchik'."

    [ "$(bkcloud context -o json | jq '.bkcontext.context.service')" = '"radial-chart"' ] ||
        error "Incorrect bkcloud service. Expected 'radial-chart'."

    bkcloud context -o json | jq '.bkcontext.context.installation' | grep -q "kubernetes-$ENV" ||
        error "Incorrect bkcloud installation. Expected 'kubernetes-$ENV'."
}

error() {
    printf "\e[0;31mERROR: $1\e[0m\n" 1>&2;
    exit 1
}

main "$@"; exit