package gov.nist.hit.hl7.igamt.datatype.service.newrobexport;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoConfiguration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import com.mongodb.ServerAddress;

@Configuration
@EnableMongoRepositories("gov.nist.hit.hl7.igamt")
public class MongoConfig extends AbstractMongoConfiguration {

	@Override
	protected String getDatabaseName() {
		return "igamt-hl7";
	}

	@Override
	public Mongo mongo() throws Exception {
		return new MongoClient(new ServerAddress("localhost", 27017));
	}
	
	@Override
	protected String getMappingBasePackage() {
		return "gov.nist.hit.hl7.igamt";
	}
}
