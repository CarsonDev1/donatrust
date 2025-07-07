import React, { useState, useEffect } from 'react';
import Slider from '../../components/ui/Slider';
import PagerIndicator from '../../components/ui/PagerIndicator';
import Button from '../../components/ui/Button';
import campaignService from '../../services/campaignService';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentCampaignSlide, setCampaignSlide] = useState(0);
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default categories fallback
  const defaultCategories = [
    { icon: '/images/img_logo_24x27.png', label: 'Natural disaster' },
    { icon: '/images/img_logo_1.png', label: 'Education' },
    { icon: '/images/img_logo_27x27.png', label: 'Children' },
    { icon: '/images/img_logo_2.png', label: 'Poor people' },
    { icon: '/images/img_logo_3.png', label: 'Elderly' },
    { icon: '/images/img_logo_4.png', label: 'People with disabilities' },
    { icon: '/images/img_logo_5.png', label: 'Serious illness' },
    { icon: '/images/img_logo_6.png', label: 'Mountainous area' },
    { icon: '/images/img_logo_7.png', label: 'Environment' },
  ];

  const organizations = [
    {
      id: 1,
      name: 'Quỹ Từ thiện Nâng bước\ntuổi thơ',
      amount: '53,482,393 VND',
      image: '/images/img_image_18_160x160.png',
    },
    {
      id: 2,
      name: 'Quỹ vì Trẻ em khuyết tật\nViệt Nam',
      amount: '53,482,393 VND',
      image: '/images/img_image_18_1.png',
    },
    {
      id: 3,
      name: 'Trung tâm Con người và Thiên nhiên',
      amount: '53,482,393 VND',
      image: '/images/img_image_18_2.png',
    },
  ];

  // Fetch featured campaigns and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch featured campaigns and categories in parallel
        const [campaignsResponse, categoriesResponse] = await Promise.allSettled([
          campaignService.getFeaturedCampaigns(),
          campaignService.getCategories(),
        ]);

        // Handle campaigns response
        if (campaignsResponse.status === 'fulfilled') {
          setCampaigns(campaignsResponse.value.data || []);
        } else {
          console.warn('Failed to fetch campaigns:', campaignsResponse.reason);
          setCampaigns([]); // Fallback to empty array
        }

        // Handle categories response
        if (categoriesResponse.status === 'fulfilled') {
          setCategories(categoriesResponse.value.data || defaultCategories);
        } else {
          console.warn('Failed to fetch categories:', categoriesResponse.reason);
          setCategories(defaultCategories); // Fallback to default categories
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        // Use fallback data
        setCampaigns([]);
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleCampaignSlideChange = (direction) => {
    if (direction === 'next' && currentCampaignSlide < campaigns.length - 3) {
      setCampaignSlide(currentCampaignSlide + 1);
    } else if (direction === 'prev' && currentCampaignSlide > 0) {
      setCampaignSlide(currentCampaignSlide - 1);
    }
  };

  const handleExploreClick = () => {
    window.location.href = '/campaigns';
  };

  const handleLearnMoreClick = () => {
    console.log('Learn more about DonaTrust clicked');
  };

  const handleViewAllClick = () => {
    window.location.href = '/campaigns';
  };

  const handleViewAllOrganizationsClick = () => {
    console.log('View all organizations clicked');
  };

  const handleCampaignDetailClick = (campaignId) => {
    window.location.href = `/campaign/${campaignId}`;
  };

  const handleOrganizationInfoClick = (orgId) => {
    console.log(`Organization ${orgId} info clicked`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-global-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-global-3">
      {/* Hero Section with Slider */}
      <div className="relative w-full h-[396px]">
        <Slider
          title="JOIN HANDS TO BUILD A BETTER COMMUNITY!"
          subtitle="Discover and support trustworthy charitable projects."
          buttonText="EXPLORE CAMPAIGN"
          backgroundImage="/images/bacground_homepage.jpg"
          onButtonClick={handleExploreClick}
        />

        {/* Pager Indicator */}
        <div className="absolute bottom-[17px] left-1/2 transform -translate-x-1/2">
          <PagerIndicator
            totalPages={3}
            currentPage={currentSlide}
            onPageChange={handleSlideChange}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="flex flex-row justify-center items-center w-full h-[60px] mt-[35px] px-[134px]">
        <div className="flex flex-row space-x-[33px]">
          {categories.map((category, index) => (
            <div
              key={category.id || index}
              className="flex flex-col items-center cursor-pointer hover:opacity-80"
            >
              <img
                src={category.icon || category.iconUrl || '/images/img_logo.png'}
                alt={category.label || category.name}
                className="w-[27px] h-[27px] mb-[2px]"
                onError={(e) => {
                  e.target.src = '/images/img_logo.png'; // Fallback icon
                }}
              />
              <span className="text-[9px] font-roboto font-medium text-global-1 text-center leading-[11px] max-w-[74px]">
                {category.label || category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Campaigns Section */}
      <div className="flex flex-col items-center w-full mt-[29px]">
        <h2 className="text-base font-roboto font-semibold text-global-1 text-center leading-[19px]">
          FEATURED FUNDRAISING CAMPAIGN
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 mb-6 max-w-md">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Campaign Slider */}
        {campaigns.length > 0 ? (
          <div className="flex flex-row items-center w-full mt-[52px] px-[89px]">
            {/* Previous Button */}
            <button
              onClick={() => handleCampaignSlideChange('prev')}
              className="mr-[24px] hover:opacity-80"
              disabled={currentCampaignSlide === 0}
            >
              <img
                src="/images/img_vector_140.svg"
                alt="Previous"
                className="w-3 h-[28px] transform rotate-180"
              />
            </button>

            {/* Campaign Cards */}
            <div className="flex flex-row space-x-[34px] overflow-hidden">
              {campaigns
                .slice(currentCampaignSlide, currentCampaignSlide + 3)
                .map((campaign, index) => (
                  <div key={campaign.id || index} className="flex flex-col w-[122px]">
                    {/* Campaign Image with Category Tag */}
                    <div className="relative w-[122px] h-[95px] mb-[1px]">
                      <img
                        src={campaign.image || campaign.imageUrl || '/images/img_image_18.png'}
                        alt={campaign.title}
                        className="w-full h-full object-cover rounded-sm"
                        onError={(e) => {
                          e.target.src = '/images/img_image_18.png'; // Fallback image
                        }}
                      />
                      <div className="absolute top-[6px] right-[7px] bg-global-4 px-2 py-1 rounded-sm">
                        <span className="text-[4px] font-inter font-semibold text-global-8 leading-[5px]">
                          {campaign.category || 'General'}
                        </span>
                      </div>
                      <img
                        src={
                          campaign.avatar || campaign.charityAvatar || '/images/img_ellipse_8.png'
                        }
                        alt="Organization Avatar"
                        className="absolute bottom-[-9px] left-1/2 transform -translate-x-1/2 w-[19px] h-[19px] rounded-full"
                        onError={(e) => {
                          e.target.src = '/images/img_ellipse_8.png'; // Fallback avatar
                        }}
                      />
                    </div>

                    {/* Campaign Details Card */}
                    <div className="bg-global-2 rounded-sm shadow-[0px_2px_5px_#abbed166] p-2 w-[105px] h-[82px]">
                      <p className="text-[4px] font-inter font-semibold text-global-6 text-center leading-[5px] mb-1">
                        {campaign.organization || campaign.charityName || 'Unknown Organization'}
                      </p>
                      <h3 className="text-[7px] font-inter font-semibold text-global-3 text-center leading-[9px] mb-2">
                        {campaign.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="w-[91px] h-[11px] mb-1 bg-gray-200 rounded">
                        <div
                          className="h-full bg-blue-500 rounded"
                          style={{
                            width: `${Math.min((campaign.raisedAmount / campaign.goalAmount) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>

                      {/* Amount and Percentage */}
                      <div className="flex flex-row justify-between items-center mb-1">
                        <span className="text-[4px] font-inter font-semibold text-global-6 leading-[5px]">
                          {campaign.raised ||
                            new Intl.NumberFormat('vi-VN').format(campaign.raisedAmount || 0)}
                        </span>
                        <span className="text-[4px] font-inter font-semibold text-global-6 leading-[5px]">
                          {campaign.percentage ||
                            `${Math.round(((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100)}%`}
                        </span>
                      </div>

                      <p className="text-[4px] font-inter font-semibold text-global-6 leading-[5px] mb-2">
                        with the goal of{' '}
                        {campaign.goal ||
                          new Intl.NumberFormat('vi-VN').format(campaign.goalAmount || 0)}{' '}
                        VND
                      </p>

                      {/* Detail Button */}
                      <button
                        onClick={() => handleCampaignDetailClick(campaign.id)}
                        className="flex flex-row items-center hover:opacity-80"
                      >
                        <span className="text-[6px] font-inter font-semibold text-global-5 leading-[9px] mr-1">
                          Detail
                        </span>
                        <img
                          src="/images/img_24_arrows_directions_right.svg"
                          alt="Arrow Right"
                          className="w-2 h-2"
                        />
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Next Button */}
            <button
              onClick={() => handleCampaignSlideChange('next')}
              className="ml-[25px] hover:opacity-80"
              disabled={currentCampaignSlide >= campaigns.length - 3}
            >
              <img src="/images/img_vector_140.svg" alt="Next" className="w-3 h-[28px]" />
            </button>
          </div>
        ) : (
          // No campaigns state
          <div className="mt-[52px] text-center py-12">
            <p className="text-global-6 mb-4">No featured campaigns available at the moment.</p>
            <Button variant="tertiary" size="md" onClick={handleViewAllClick}>
              Browse All Campaigns →
            </Button>
          </div>
        )}

        {/* View All Button */}
        {campaigns.length > 0 && (
          <div className="mt-[22px]">
            <Button variant="tertiary" size="md" onClick={handleViewAllClick}>
              View all →
            </Button>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="w-full h-[219px] bg-global-2 mt-[37px]">
        <div className="flex flex-row w-full h-full">
          {/* Left Content */}
          <div className="flex flex-col ml-[100px] mt-[67px] w-[284px] h-[83px]">
            <h2 className="text-[25px] font-inter font-semibold text-global-4 leading-[30px]">
              The numbers speak for themselves.
            </h2>
            <p className="text-[11px] font-inter text-global-2 leading-[14px] mt-[16px]">
              Quick stats about DonaTrust
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="flex flex-col ml-[138px] mt-[44px] w-[379px] h-[130px]">
            {/* First Row */}
            <div className="flex flex-row w-full h-[43px] mb-[28px]">
              <div className="flex flex-row items-center">
                <img
                  src="/images/img_icon.svg"
                  alt="Supporters Icon"
                  className="w-[33px] h-[33px] mr-[11px]"
                />
                <div className="flex flex-col">
                  <span className="text-[19px] font-inter font-bold text-global-4 leading-6">
                    1,500+
                  </span>
                  <span className="text-[11px] font-inter text-global-6 leading-[14px]">
                    Supporter
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-center ml-[120px]">
                <img
                  src="/images/img_icon_teal_300.svg"
                  alt="Charity Icon"
                  className="w-[33px] h-[33px] mr-[12px]"
                />
                <div className="flex flex-col">
                  <span className="text-[19px] font-inter font-bold text-global-4 leading-6">
                    200+
                  </span>
                  <span className="text-[11px] font-inter text-global-6 leading-[14px]">
                    Charity
                  </span>
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-row w-full h-[60px]">
              <div className="flex flex-row items-center">
                <img
                  src="/images/img_icon_teal_300_33x33.svg"
                  alt="Campaign Icon"
                  className="w-[33px] h-[33px] mr-[11px]"
                />
                <div className="flex flex-col">
                  <span className="text-[19px] font-inter font-bold text-global-4 leading-6">
                    328+
                  </span>
                  <span className="text-[11px] font-inter text-global-6 leading-[14px]">
                    Campaign
                  </span>
                </div>
              </div>

              <div className="flex flex-row items-center ml-[98px]">
                <img
                  src="/images/img_icon_33x33.svg"
                  alt="Donation Icon"
                  className="w-[33px] h-[33px] mr-[12px]"
                />
                <div className="flex flex-col">
                  <span className="text-[19px] font-inter font-bold text-global-4 leading-6">
                    132,920,000
                  </span>
                  <span className="text-[11px] font-inter text-global-6 leading-4">
                    Total amount donated (VND)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About DonaTrust Section */}
      <div className="flex flex-row w-full mt-[34px] px-[100px]">
        <img
          src="/images/img_frame_6.png"
          alt="DonaTrust Illustration"
          className="w-[350px] h-[215px]"
        />

        <div className="flex flex-col ml-[19px] mt-[29px] w-[433px] h-[156px]">
          <h2 className="text-[25px] font-inter font-semibold text-global-4 leading-[31px]">
            What is DonaTrust?
          </h2>
          <p className="text-xs font-inter text-global-6 leading-[13px] mt-[11px]">
            DonaTrust is a system for managing charitable donations, an intermediary platform
            connecting charities and donors. The main goal of the system is to create a transparent,
            convenient and efficient environment for calling for and managing charitable activities.
          </p>
          <div className="mt-[21px]">
            <Button variant="tertiary" size="lg" onClick={handleLearnMoreClick}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Outstanding Organizations Section */}
      <div className="flex flex-col items-center w-full mt-[34px] mb-[37px]">
        <h2 className="text-[25px] font-inter font-semibold text-global-4 leading-[31px] text-center">
          Outstanding Fundraising Organization/Individual
        </h2>

        <div className="flex flex-row space-x-[29px] mt-[51px] px-[92px]">
          {organizations.map((org, index) => (
            <div key={org.id} className="relative w-[256px] h-[318px]">
              {/* Organization Image */}
              <img
                src={org.image}
                alt={org.name}
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[160px] h-[160px] rounded-[80px]"
              />

              {/* Organization Card */}
              <div className="absolute bottom-0 w-full h-[249px] bg-global-1 rounded-[3px]">
                <div className="bg-global-2 rounded-[5px] shadow-[0px_5px_11px_#abbed166] mx-[17px] mt-[97px] p-3 h-[144px]">
                  <h3 className="text-[13px] font-inter font-semibold text-global-3 text-center leading-[19px] mb-[8px]">
                    {org.name}
                  </h3>
                  <p className="text-[11px] font-inter font-semibold text-global-6 text-center leading-[14px] mb-[3px]">
                    Fundraising amount
                  </p>
                  <p className="text-[13px] font-inter font-semibold text-global-7 text-center leading-[17px] mb-[6px]">
                    {org.amount}
                  </p>

                  {/* Information Button */}
                  <button
                    onClick={() => handleOrganizationInfoClick(org.id)}
                    className="flex flex-row items-center justify-center w-full hover:opacity-80"
                  >
                    <span className="text-[13px] font-inter font-semibold text-global-5 leading-[17px] mr-2">
                      Information
                    </span>
                    <img
                      src="/images/img_24_arrows_directions_right.svg"
                      alt="Arrow Right"
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Organizations Button */}
        <div className="mt-[22px]">
          <Button variant="tertiary" size="md" onClick={handleViewAllOrganizationsClick}>
            View all →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
