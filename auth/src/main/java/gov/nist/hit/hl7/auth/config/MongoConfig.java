package gov.nist.hit.hl7.auth.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories(basePackages={"gov.nist.hit.hl7.auth.repository"})

public class MongoConfig extends AbstractMongoConfiguration {

	@Value("${spring.data.mongodb.host}")
	private String host;

	
	@Value("${spring.data.mongodb.authentication-database}")
	private String authDb;

	@Value("${spring.data.mongodb.port}")
	private int port;
	
	@Override
	protected String getDatabaseName() {
		return authDb;
	}



	@Override
	public Mongo mongo() throws Exception {
		
		return new MongoClient(new ServerAddress(host,port));

	}

	@Override
	protected String getMappingBasePackage() {
		return "gov.nist.hit.hl7.auth";
	}

}