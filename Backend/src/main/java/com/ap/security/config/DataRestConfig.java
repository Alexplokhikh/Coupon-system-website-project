package com.ap.security.config;

import com.ap.model.entity.Coupon;
import com.ap.model.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {
                HttpMethod.PATCH,
                HttpMethod.POST,
                HttpMethod.PUT,
                HttpMethod.DELETE
        };

        config.exposeIdsFor(Coupon.class);
        config.exposeIdsFor(Review.class);

        disableHttpMethods(Coupon.class, config, unsupportedActions);
        disableHttpMethods(Review.class, config, unsupportedActions);

    }

    private void disableHttpMethods(Class clazz,
                                    RepositoryRestConfiguration config,
                                    HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(clazz)
                .withItemExposure((metadata, httpMethods) ->
                        httpMethods.disable(unsupportedActions))
                        .withCollectionExposure((metadata, httpMethods) ->
                                httpMethods.disable(unsupportedActions));

    }
}
