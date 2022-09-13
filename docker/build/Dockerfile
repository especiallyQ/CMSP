FROM openeuler/openeuler:20.03-lts-sp3

# sed -i 's/http:\/\/repo.openeuler.org/http:\/\/cmsp.dd2a.net:8081\/repository\/openeuler/g' /etc/yum.repos.d/openEuler.repo && \
# sed -i 's/http:\/\/cmsp.dd2a.net:8081\/repository\/openeuler/http:\/\/repo.openeuler.org/g' /etc/yum.repos.d/openEuler.repo && \
RUN sed -i 's/gpgcheck=1/gpgcheck=0/g' /etc/yum.repos.d/openEuler.repo && \
    yum -y update && \
    yum -y install gettext && \
    yum -y install nginx.x86_64 && \
    sed -i 's/gpgcheck=0/gpgcheck=1/g' /etc/yum.repos.d/openEuler.repo

COPY docs /data/cmsp-web/nginx
COPY dist /data/cmsp-web/dist

RUN mkdir -p /etc/nginx/conf.d && \
    cp -f /data/cmsp-web/nginx/nginx.conf /etc/nginx/nginx.conf

WORKDIR /data/cmsp-web/
EXPOSE 5000

ENV uri='$uri' \
    CMSP_WEB_REQUEST_PREFIX="/mgr" \
    CMSP_NODE_MANAGER_PROTOCOL="http" \
    CMSP_NODE_MANAGER_IP="127.0.0.1" \
    CMSP_NODE_MANAGER_PORT="5001" \
    CMSP_NODE_MANAGER_CONTEXT_PATH="/CMSP-Node-Manager"

# start nginx commond
ENTRYPOINT envsubst < /data/cmsp-web/nginx/cmsp-web.conf > /etc/nginx/conf.d/cmsp-web.conf && nginx -c /etc/nginx/nginx.conf -g 'daemon off;'
